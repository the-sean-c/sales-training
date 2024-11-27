"""rename auth0_id to auth_id

Revision ID: 0fe554801ac1
Revises: fc2567a78d1d
Create Date: 2024-11-27 16:23:23.333235

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0fe554801ac1"
down_revision: Union[str, None] = "fc2567a78d1d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("users", "auth0_id", new_column_name="auth_id")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("users", "auth_id", new_column_name="auth0_id")
    # ### end Alembic commands ###