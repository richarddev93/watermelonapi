import LessonService from "../services/lesson.service.js";

async function findAll(req, res) {
  const dataAll = await LessonService.findAll();

  const tableName= 'books'
  const created= [...dataAll]
  const updated= [...dataAll]
  const deleted= [...dataAll.map(data=>data.id)]

  const changes = {
    [tableName]:{
        created:created,
        updated:updated,
        deleted:deleted
    }
  }



  res.json({changes,timestamp:Date.now()});
}
async function findByID(req, res) {
  const data = await LessonService.findByID(req.params.UserID);

  res.json(data);
}

async function create(req, res) {
  const data = await LessonService.create(req.body);

  res.json(data);
}

async function update(req, res) {
  const data = await LessonService.update(req.params.UserID, req.body);

  res.json(data);
}

async function deleteByID(req, res) {
  await LessonService.deleteByID(req.params.UserID);

  res.json(`Success`);
}

export default {
    findAll,
  findByID,
  create,
  update,
  deleteByID,
};
