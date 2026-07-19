import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordRecoveryCodesTable1733400000000 implements MigrationInterface {
  name = 'CreatePasswordRecoveryCodesTable1733400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "password_recovery_codes" (
        "id_recovery" SERIAL NOT NULL,
        "usuario_id"  INTEGER                             NOT NULL,
        "code"        VARCHAR(10)                         NOT NULL,
        "expires_at"  TIMESTAMP                           NOT NULL,
        "used"        BOOLEAN   DEFAULT false             NOT NULL,
        "created_at"  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "ip"          VARCHAR(45),
        CONSTRAINT "PK_c5a232efc0c5805fa4b818298e5" PRIMARY KEY ("id_recovery")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_password_recovery_usuario_code
        ON password_recovery_codes(usuario_id, code, used)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_password_recovery_expires
        ON password_recovery_codes(expires_at)
    `);

    // FK con el nombre exacto del constraint original (igual que en Supabase)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'FK_72889bac6a3a69faddfdca00923'
        ) THEN
          ALTER TABLE "password_recovery_codes"
            ADD CONSTRAINT "FK_72889bac6a3a69faddfdca00923"
            FOREIGN KEY ("usuario_id")
            REFERENCES "usuarios"("id_usuario")
            ON DELETE CASCADE;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "password_recovery_codes"
        DROP CONSTRAINT IF EXISTS "FK_72889bac6a3a69faddfdca00923"
    `);
    await queryRunner.query(`DROP TABLE IF EXISTS "password_recovery_codes"`);
  }
}