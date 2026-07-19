import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQrTables1734600000000 implements MigrationInterface {
  name = 'CreateQrTables1734600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilitar extensión uuid-ossp (necesaria para uuid_generate_v4 en Railway/PG sin la extensión por defecto)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Tabla tipos_qr
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tipos_qr" (
        "id_tipo_qr"         SERIAL       NOT NULL,
        "codigo"             VARCHAR(50)  NOT NULL,
        "nombre"             VARCHAR(100) NOT NULL,
        "descripcion"        VARCHAR(255),
        "requiere_unico_uso" BOOLEAN      NOT NULL DEFAULT true,
        "activo"             BOOLEAN      NOT NULL DEFAULT true,
        "created_at"         TIMESTAMP    NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_af68b32c3803f402217b7e0c7d4" UNIQUE ("codigo"),
        CONSTRAINT "PK_0a210c064534c3de1b7182b09e9" PRIMARY KEY ("id_tipo_qr")
      )
    `);

    // Tabla usuarios_qr
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "usuarios_qr" (
        "id_usuario_qr" UUID        NOT NULL DEFAULT uuid_generate_v4(),
        "id_usuario"    INT         NOT NULL,
        "id_tipo_qr"    INT         NOT NULL,
        "token"         UUID        NOT NULL,
        "estado"        VARCHAR(20) NOT NULL DEFAULT 'activo',
        "usado"         BOOLEAN     NOT NULL DEFAULT false,
        "fecha_uso"     TIMESTAMP,
        "expiracion"    TIMESTAMP,
        "activo"        BOOLEAN     NOT NULL DEFAULT true,
        "created_at"    TIMESTAMP   NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_16c0ee2eaa55903e345aab6cedd" UNIQUE ("token"),
        CONSTRAINT "PK_38319c7df9dc7a7deacad2f36a8" PRIMARY KEY ("id_usuario_qr")
      )
    `);

    // Índices
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_usuario_tipo_qr ON usuarios_qr(id_usuario, id_tipo_qr)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_qr_usuario      ON usuarios_qr(id_usuario)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_qr_tipo         ON usuarios_qr(id_tipo_qr)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_qr_token        ON usuarios_qr(token)`);

    // Foreign Key con guard
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_usuarios_qr_tipo_qr'
        ) THEN
          ALTER TABLE "usuarios_qr"
            ADD CONSTRAINT "FK_usuarios_qr_tipo_qr"
            FOREIGN KEY ("id_tipo_qr")
            REFERENCES "tipos_qr"("id_tipo_qr")
            ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuarios_qr" DROP CONSTRAINT IF EXISTS "FK_usuarios_qr_tipo_qr"`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_qr_token`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_qr_tipo`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_qr_usuario`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_usuario_tipo_qr`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuarios_qr"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tipos_qr"`);
  }
}
