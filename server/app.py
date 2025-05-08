from server import create_app, db
from flask_migrate import Migrate
from flask.cli import with_appcontext
import click

app = create_app()
migrate = Migrate(app, db)

@click.command(name='create_db')
@with_appcontext
def create_db():
    db.create_all()
    click.echo("Database tables created!")

app.cli.add_command(create_db)

if __name__ == "__main__":
    app.run(debug=True, port=5000)