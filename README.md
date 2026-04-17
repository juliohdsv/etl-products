# ETL Products API

API de ETL que consome produtos da [Fake Store API](https://fakestoreapi.com/), transforma os dados e salva em um banco PostgreSQL usando Prisma.

O projeto oferece:

- importação manual via API;
- importação automática via cron job a cada minuto;
- prevenção de duplicatas com base em `idFakeStoreProducts`;
- listagem de produtos armazenados;
- filtro de produtos por intervalo de datas;
- documentação Swagger.

## Funcionalidades

- `POST /api/products`: dispara a importação de produtos da Fake Store API.
- `GET /api/products`: retorna todos os produtos salvos no banco.
- `GET /api/products/by-date`: filtra produtos por intervalo de datas de criação.
- Cron job executa o mesmo processo de importação a cada minuto.
- Uso de `createMany(skipDuplicates: true)` para evitar registros duplicados.

## Estrutura do projeto

- `src/server.ts` — ponto de entrada e configuração do servidor.
- `src/infra/config/swagger.ts` — configuração do Swagger e Swagger UI.
- `src/infra/config/cors.ts` — configuração de CORS.
- `src/infra/config/error-handler-global.ts` — tratamento global de erros.
- `src/infra/http/routes/products-routes.ts` — definição das rotas.
- `src/infra/http/controlers/create-product-controller.ts` — controller para importação manual.
- `src/infra/http/controlers/get-products-controller.ts` — controller para listar produtos.
- `src/infra/http/controlers/find-by-date-products-controller.ts` — controller para filtro por datas.
- `src/app/use-cases/create-products-usecase.ts` — lógica de ETL.
- `src/app/use-cases/get-products-usecase.ts` — busca todos os produtos.
- `src/app/use-cases/find-by-date-products-usecase.ts` — busca produtos por período.
- `src/infra/gateways/products-gateway.ts` — gateway de integração com Fake Store API.
- `src/infra/jobs/products-cron.ts` — cron job para execução periódica.
- `src/infra/database/prisma-client.ts` — cliente Prisma.
- `src/lib/fakes-store-api.ts` — cliente Axios para Fake Store API.

## Requisitos

- Node.js 18+
- pnpm
- PostgreSQL

## Instalação

```bash
git clone <repo-url>
cd etl-products
pnpm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Exemplo de `.env`:

```env
NODE_PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://docker:docker@localhost:5432/products?schema=public"
```

## Banco de dados

Execute as migrações:

```bash
npx prisma migrate dev
```

## Executando o projeto

```bash
pnpm dev
```

O servidor é iniciado na porta configurada em `NODE_PORT` (padrão: `4000`).

## Documentação da API

A documentação Swagger está disponível em:

```text
http://localhost:4000/api/docs
```

A especificação OpenAPI JSON fica em:

```text
http://localhost:4000/documentation/json
```

## Endpoints da API

### `POST /api/products`

Dispara a importação de produtos da Fake Store API e salva os dados no banco.

- **Método**: `POST`
- **URL**: `/api/products`
- **Body**: nenhum
- **Headers**: nenhum

#### Exemplo de resposta de sucesso (201)

```json
{
  "success": true,
  "message": "Products saved successfully",
  "data": {
    "total": 20,
    "inserted": 15,
    "duplicates": 5
  },
  "timestamp": "2026-04-17T12:00:00.000Z"
}
```

#### Erros possíveis

- `400` — erro de validação ou requisição inválida
- `502` — falha no gateway externo ou na Fake Store API

### `GET /api/products`

Retorna todos os produtos salvos no banco.

- **Método**: `GET`
- **URL**: `/api/products`

#### Exemplo de resposta de sucesso (200)

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "idFakeStoreProducts": 1,
      "title": "Product 1",
      "price": 100,
      "image": "https://...",
      "createdAt": "2026-04-17T12:00:00.000Z",
      "updatedAt": "2026-04-17T12:00:00.000Z"
    }
  ],
  "timestamp": "2026-04-17T12:00:00.000Z"
}
```

### `GET /api/products/by-date?from=YYYY-MM-DD&to=YYYY-MM-DD`

Retorna produtos cadastrados entre as datas `from` e `to`, inclusive.

- **Método**: `GET`
- **URL**: `/api/products/by-date`
- **Query params**:
  - `from` — data inicial no formato `YYYY-MM-DD`
  - `to` — data final no formato `YYYY-MM-DD`

#### Exemplo

```text
GET /api/products/by-date?from=2026-04-17&to=2026-04-18
```

#### Exemplo de resposta de sucesso (200)

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "idFakeStoreProducts": 1,
        "title": "Product 1",
        "price": 100,
        "image": "https://...",
        "createdAt": "2026-04-17T12:00:00.000Z",
        "updatedAt": "2026-04-17T12:00:00.000Z"
      }
    ],
    "total": 1
  },
  "timestamp": "2026-04-17T12:00:00.000Z"
}
```

## Comportamento do ETL

- `CreateProductController.handle()` aciona o caso de uso `CreateProductsUseCase`.
- `ProductsGateway` busca produtos na Fake Store API.
- Os dados são mapeados para o formato do banco.
- `Prisma createMany({ skipDuplicates: true })` insere registros e evita duplicatas.
- A resposta retorna `total`, `inserted` e `duplicates`.
- O cron job em `src/infra/jobs/products-cron.ts` executa essa mesma sequência a cada minuto.

## Fluxo do sistema

```mermaid
graph TD
  A[Cliente] -->|POST /api/products| B[CreateProductController]
  B --> D[CreateProductsUseCase]
  D --> E[ProductsGateway]
  E -->|GET /products| F[Fake Store API]
  F -->|200 OK| E
  E --> G[Mape dados]
  G --> H[Prisma createMany(skipDuplicates)]
  H --> I[PostgreSQL Database]
  H --> J[Retorna estatísticas]
  J --> B

  C[Cron job a cada 1 minuto] -->|executa| D

  K[Cliente] -->|GET /api/products| L[GetProductsController]
  L --> M[GetProductsUseCase]
  M --> I

  N[Cliente] -->|GET /api/products/by-date| O[FindByDateProductsController]
  O --> P[FindByDateProductsUseCase]
  P --> I
```

## Esquema do banco

Modelo Prisma `Product`:

```prisma
model Product {
  id                  String   @id @default(uuid())
  idFakeStoreProducts Int      @unique @map("id_fake_store_products")
  title               String
  price               Float
  image               String
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

## Tecnologias

- Fastify
- Prisma
- Zod
- Axios
- node-cron
- Swagger / Swagger UI

## Scripts

- `pnpm dev` — inicia o servidor de desenvolvimento
- `npx prisma migrate dev` — executa migrações
- `npx prisma studio` — abre o Prisma Studio

## Observações

- Confira `DATABASE_URL` antes de rodar as migrações.
- A importação manual é idempotente graças ao `skipDuplicates`.
- O Swagger está configurado em `/api/docs`.
