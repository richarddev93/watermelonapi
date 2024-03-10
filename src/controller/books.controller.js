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
async function pullChanges(req, res) {
  const { bookID } = req.params;
  const { last_pulled_at } = req.query;

  //primeiro buscar todos os itens  basecom base no id e last_pulled_at
  //se o last_pulled_at vier vazio trazer tudo
  const dataAll = await BookService.findByIDAndLastPull({
    bookID,
    last_pulled_at,
  });
  const isFirstSync =
    last_pulled_at === null ||
    last_pulled_at === 0 ||
    last_pulled_at == undefined;

  // Filtrar registros criados ou atualizados após lastPulledAt
  const updatedRecords = dataAll.filter(
    (record) => record.updated_at > last_pulled_at
  );

  // Filtrar IDs de registros excluídos após lastPulledAt
  const deletedRecordIds = dataAll
    .filter((record) => record.deleted_at > last_pulled_at)
    .map((record) => record.id);

  const tableName = "books";
  const created = isFirstSync
    ? dataAll
    : dataAll.filter((record) => record.created_at > last_pulled_at);

  const changes = {
    [tableName]: {
      created: created,
      updated: updatedRecords,
      deleted: deletedRecordIds,
    },
  };
  res.json({ changes, timestamp: Date.now() });
}

async function pushChanges(req, res) {
  const tableName = "books";

  const { last_pulled_at } = req.query;
  const { changes } = req.body;
  const changesAux = [...Object.values(changes)];

  const changesData = changes[tableName];
  if (changesData) {
    // separa e cria tudo que é created
    const { created, updated, deleted } = changesData;

    //verificar se vale verifica se as infos de lastupdate estão ok
    // e contar com mais uma etapa de validação para a criação, se oarquivo nunca foi pullado
    //do server certeza que cria, se não atualiza
    // todo: adicionar mais essa verificação

    created.forEach(async (element) => {
      element.last_pulled_at = last_pulled_at;
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

  res.json({ ok:true, timestamp: Date.now() });
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
