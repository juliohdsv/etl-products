# ETL Products API

API de ETL que consome produtos da [Fake Store API](https://fakestoreapi.com/), transforma os dados e salva em um banco PostgreSQL usando Prisma.

O projeto oferece:

- importação manual via API;
- importação automática por cron job a cada minuto;
- prevenção de duplicatas usando `idFakeStoreProducts`;
- listagem e filtro por data dos produtos armazenados;
- documentação Swagger disponível.

## Funcionalidades

- `POST /api/products`: importa produtos da Fake Store API e salva no banco.
- `GET /api/products`: lista todos os produtos armazenados.
- `GET /api/products/by-date`: filtra produtos por data de criação.
- `src/infra/jobs/products-cron.ts`: cron job que executa a importação a cada minuto.
- `Prisma createMany({ skipDuplicates: true })`: garante idempotência e evita duplicações.

## Estrutura do projeto

- `src/server.ts` — ponto de entrada e configuração do servidor.
- `src/infra/config/swagger.ts` — configuração do Swagger e Swagger UI.
- `src/infra/config/cors.ts` — configuração de CORS.
- `src/infra/config/error-handler-global.ts` — tratamento global de erros.
- `src/infra/http/routes/products-routes.ts` — rotas do recurso de produtos.
- `src/infra/http/controlers/create-product-controller.ts` — controller para importação manual.
- `src/infra/http/controlers/get-products-controller.ts` — controller para listagem de produtos.
- `src/infra/http/controlers/find-by-date-products-controller.ts` — controller para filtro por intervalo de datas.
- `src/app/use-cases/create-products-usecase.ts` — lógica de importação e persistência.
- `src/app/use-cases/get-products-usecase.ts` — busca todos os produtos do banco.
- `src/app/use-cases/find-by-date-products-usecase.ts` — busca produtos por período.
- `src/infra/gateways/products-gateway.ts` — gateway para Fake Store API.
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

Retorna todos os produtos armazenados no banco.

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

Retorna produtos cadastrados entre as datas `from` e `to`.

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

- `CreateProductController.handle()` aciona `CreateProductsUseCase`.
- `ProductsGateway` busca produtos na Fake Store API.
- Os dados são transformados e mapeados para o modelo de banco.
- `Prisma createMany({ skipDuplicates: true })` insere apenas novos produtos.
- A resposta retorna `total`, `inserted` e `duplicates`.
- O cron job em `src/infra/jobs/products-cron.ts` executa esse processo a cada minuto.

## Fluxo do sistema

```mermaid
graph LR
  Client[Cliente] -->|POST /api/products| CreateController[CreateProductController]
  CreateController --> CreateUseCase[CreateProductsUseCase]
  CreateUseCase --> ProductsGateway[ProductsGateway]
  ProductsGateway -->|GET /products| FakeStore[Fake Store API]
  FakeStore -->|200 OK| ProductsGateway
  ProductsGateway --> MapData[Mapeia dados para DTO]
  MapData --> Prisma[Prisma createMany(skipDuplicates)]
  Prisma --> Database[PostgreSQL Database]
  Prisma -->|Resultados| CreateController

  Cron[Cron job (1 minuto)] -->|executa| CreateUseCase

  Client -->|GET /api/products| GetController[GetProductsController]
  GetController --> GetUseCase[GetProductsUseCase]
  GetUseCase --> Database

  Client -->|GET /api/products/by-date| FindController[FindByDateProductsController]
  FindController --> FindUseCase[FindByDateProductsUseCase]
  FindUseCase --> Database
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
