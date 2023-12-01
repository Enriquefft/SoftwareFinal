# Elysia with Bun runtime

## Development

- To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

- To migrate use:

```bash
bun migrate
bun run models/migrate.ts
```

## Pregunta 3

- [ ] No sería necesarío cambiar nada, actualmente el código ya soporta
      transferencias de cantidades medianas; sin embargo, de ser necesario, se
      podrían realizar un par de migraciones de tecnologias para que funcione
      acorde a un sistema bancario seguro. En primer lugar, sería recomendable
      migrar a una base de datos como postgreSQL ya que tienen soport
      out-of-the-box para columnas de tipo `money` que nos ayudaría a mantener
      la integridad de los datos y evitar errores de redondeo. Para complementar
      esta solución, se debería utilizar alguna librería de manejo de dinero
      como `money.js` de `openxchange` que nos ayudaría a manejar el dinero de
      manera segura y evitar errores de redondeo. Sin embargo, es importante
      considerar que javascript no es un lenguaje seguro para manejar dinero,
      por lo que se debería considerar migrar a un lenguaje que no utilize
      redondeos, como `Cobol`.
