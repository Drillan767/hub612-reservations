package main

import (
	"embed"
	"fmt"
	"log"
	"os"
	"strings"

	_ "hub612-reservations/migrations"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

//go:embed all:.output/public
var public embed.FS

func main() {
	app := pocketbase.New()
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/*", apis.Static(echo.MustSubFS(public, ".output/public"), true))

		return se.Next()
	})

	app.OnRecordAuthWithPasswordRequest().BindFunc(func(e *core.RecordAuthWithPasswordRequestEvent) error {
		if !e.Record.GetBool("verified") {
			return apis.NewForbiddenError("Your account is not verified.", nil)
		}

		return e.Next()
	})

	// Create transaction history entry
	app.OnRecordCreateRequest("users").BindFunc(func(e *core.RecordRequestEvent) error {
		return createCreditTransaction(app, e, "create")
	})

	app.OnRecordUpdateRequest("users").BindFunc(func(e *core.RecordRequestEvent) error {
		return createCreditTransaction(app, e, "update")
	})

	app.OnRecordCreateRequest()

	app.Cron().MustAdd("mensual-credits", "0 0 1 * *", func() {
		// Load all users and their companies

		users := []struct {
			Id      string `db:"id"`
			Credits int    `db:"credits"`
			Company struct {
				Id             string `db:"id"`
				MensualCredits int    `db:"mensual_credits"`
			} `db:"company"`
		}{}

		err := app.DB().
			Select("users.*").
			InnerJoin("companies", dbx.NewExp("companies.user_id = users.id")).
			All(&users)

		if err != nil {
			fmt.Println(err)
			return
		}

		for _, u := range users {
			user, err := app.FindRecordById("users", u.Id)
			if err != nil {
				fmt.Println(err)
				return
			}

			user.Set("credits", u.Credits+u.Company.MensualCredits)

			if err := app.Save(user); err != nil {
				fmt.Println(err)
				return
			}
		}
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}

}

func createCreditTransaction(app *pocketbase.PocketBase, e *core.RecordRequestEvent, action string) error {
	oldCredits := 0

	if action == "update" {
		oldRecord, err := app.FindRecordById("users", e.Record.Id)
		if err != nil {
			return err
		}

		oldCredits = oldRecord.GetInt("credits")

		if err := e.Next(); err != nil {
			return err
		}
	}

	newCredits := e.Record.GetInt("credits")

	if oldCredits == newCredits {
		return nil
	}

	info, err := e.RequestInfo()
	if err != nil {
		return err
	}

	collection, err := app.FindCollectionByNameOrId("credits_transaction")
	if err != nil {
		return err
	}

	// TODO: handle when credits is deducted post booking
	// One solution could be to check if new amount is lower than current and if
	// from and to are identical, but doesn't seem viable

	transaction := core.NewRecord(collection)
	transaction.Set("amount", newCredits)
	transaction.Set("from", info.Auth.Id)
	transaction.Set("to", e.Record.Id)

	if err := app.Save(transaction); err != nil {
		return err
	}

	return nil
}
