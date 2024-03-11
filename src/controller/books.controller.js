import BookService from "../services/book.service.js";

async function findAll(req, res) {
  const dataAll = await BookService.findAll();

  const tableName = "books";
  const created = [...dataAll];
  const updated = [...dataAll];
  const deleted = [...dataAll.map((data) => data.id)];

  const changes = {
    [tableName]: {
      created: created,
      updated: updated,
      deleted: deleted,
    },
  };

  res.json({ changes, timestamp: Date.now() });
}
async function findByID(req, res) {
  console.log("findbydid");
  const data = await BookService.findByID(req.params.UserID);

  res.json(data);
}

async function create(req, res) {
  const data = await BookService.create(req.body);

  res.json(data);
}

async function update(req, res) {
  const data = await BookService.update(req.params.bookID, req.body);

  res.json(data);
}

async function deleteByID(req, res) {
  console.log("deleteByID,", req.params);
  const data = await BookService.deleteByID(req.params.bookID);

  res.json(data);
}
async function pullChanges1(req, res) {
  console.log("Executing pullChanges.....");

  const { bookID } = req.params;
  const { last_pulled_at } = req.query;
  const isHaveLastPullDate =
    last_pulled_at === "null" ? null : parseInt(last_pulled_at);
  //primeiro buscar todos os itens  basecom base no id e last_pulled_at
  //se o last_pulled_at vier vazio trazer tudo
  console.log("pullChanges ---------------------", isHaveLastPullDate);
  const dataAll = await BookService.findAll();

  const isFirstSync =
    last_pulled_at === null ||
    last_pulled_at === 0 ||
    last_pulled_at == undefined;
  console.log("dataAll", dataAll);
  // Filtrar registros criados ou atualizados após lastPulledAt
  const updatedRecords = dataAll.filter(
    (record) => record.updated_at > isHaveLastPullDate
  );

  // Filtrar IDs de registros excluídos após lastPulledAt
  const deletedRecordIds = dataAll
    .filter((record) => record.deleted_at > isHaveLastPullDate)
    .map((record) => record.id);

  const tableName = "books";
  const created = isFirstSync
    ? dataAll
    : dataAll.filter((record) => record.created_at > isHaveLastPullDate);

  const changes = {
    [tableName]: {
      created: created,
      updated: updatedRecords,
      deleted: deletedRecordIds,
    },
  };
  res.json({ changes, timestamp: Date.now() });
}

async function pullChanges(req, res) {
  console.log("Executing pullChanges.....");

  // Extrair parâmetros da requisição
  const { bookID } = req.params;
  const { last_pulled_at } = req.query;
  const isHaveLastPullDate = last_pulled_at === "null" ? null : parseInt(last_pulled_at);
  console.log("Extracted parameters:", { bookID, last_pulled_at, isHaveLastPullDate });

  // Verificar se é a primeira sincronização
  const isFirstSync = last_pulled_at === null || last_pulled_at === 0 || last_pulled_at == undefined;
  console.log("Is first sync:", isFirstSync);

  // Buscar todos os itens
  console.log("Fetching all items...");
  const dataAll = await BookService.findAll();
  console.log("Fetched items:", dataAll);

  // Filtrar registros criados ou atualizados após lastPulledAt
  console.log("Filtering updated records...");
  const updatedRecords = dataAll.filter((record) => record.updated_at > isHaveLastPullDate);

  // Filtrar IDs de registros excluídos após lastPulledAt
  console.log("Filtering deleted records...");
  const deletedRecordIds = dataAll
    .filter((record) => record.deleted_at > isHaveLastPullDate)
    .map((record) => record.id);

  // Determinar os registros criados após lastPulledAt
  console.log("Determining created records...");
  const created = isFirstSync
    ? dataAll
    : dataAll.filter((record) => record.created_at > isHaveLastPullDate);

  // Construir objeto de mudanças
  console.log("Building changes object...");
  const changes = {
    books: {
      created: created,
      updated: updatedRecords,
      deleted: deletedRecordIds,
    },
  };

  // Enviar resposta com as mudanças e o timestamp atual
  console.log("Sending response...");
  res.json({ changes, timestamp: Date.now() });
}


async function pushChanges(req, res) {
  console.log("Executing pushChanges");

  const tableName = "books";

  const { last_pulled_at } = req.query;
  const changes = req.body;

  const changesData = changes[tableName];

  if (changesData) {
    const { created, updated, deleted } = changesData;

    created.forEach(async (element) => {
      element.last_pulled_at = last_pulled_at;
      element.lessons = element.lessons ? element.lessons : "l1";
      console.log(element);
      const isAlready = await BookService.findByID(element.id);
      let data = null;
      if (isAlready) {
        const id = element.id;
        delete element.id;
        data = await BookService.update(id, element);
      } else {
        data = await BookService.create(element);
      }
      console.log("Criando ou atualizando...", data);
    });

    updated.forEach(async (element) => {
      element.last_pulled_at = last_pulled_at;
      const isAlready = await BookService.findByID(element.id);
      let data = null;
      if (isAlready) {
        const id = element.id;
        delete element.id;
        data = await BookService.update(id, element);
      } else {
      }
      console.log("Atualizado...", data);
    });

    deleted.forEach(async (element) => {
      const isAlready = await BookService.findByID(element.id);
      let data = null;
      if (isAlready) {
        const id = element.id;
        delete element.id;
        data = await BookService.deleteByID(id);
      } else {
      }
      console.log("deletando...", data);
    });
  }

  res.json({ ok: true, timestamp: Date.now() });
}

export default {
  findAll,
  findByID,
  create,
  update,
  deleteByID,
  pullChanges,
  pushChanges,
};
