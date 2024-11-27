"""add created_on column

Revision ID: 13f4dcfe3742
Revises: 0fe554801ac1
Create Date: 2024-11-27 16:35:32.811035

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "13f4dcfe3742"
down_revision: Union[str, None] = "0fe554801ac1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# List of tables to update
tables = [
    "users",
    "classes",
    "class_enrollments",
    "courses",
    "lessons",
    "content_blocks",
    "progress",
]


def upgrade() -> None:
    # Create the trigger function
    op.execute("""
        CREATE OR REPLACE FUNCTION update_last_modified()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.last_modified = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    """)

    for table in tables:
        # Add last_modified with CURRENT_TIMESTAMP as default
        op.add_column(
            table,
            sa.Column(
                "last_modified",
                sa.DateTime(),
                server_default=sa.text("CURRENT_TIMESTAMP"),
                nullable=False,
            ),
        )

        # Add trigger for future updates
        op.execute(f"""
            CREATE TRIGGER update_{table}_last_modified 
                BEFORE UPDATE ON {table} 
                FOR EACH ROW 
                EXECUTE FUNCTION update_last_modified();
        """)


def downgrade() -> None:
    # Drop triggers first
    for table in tables:
        op.execute(f"DROP TRIGGER IF EXISTS update_{table}_last_modified ON {table}")

    # Drop columns
    for table in tables:
        op.drop_column(table, "last_modified")

    # Finally drop the trigger function
    op.execute("DROP FUNCTION IF EXISTS update_last_modified()")
