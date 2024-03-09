import lessonRepository from "../repository/lesson.repository.js";

async function findAll() {
  const data = await lessonRepository.getAll();

  if (data) {
    return data;
  }

  return data;
}
async function findByID(UserID) {
  const data = await lessonRepository.findByID(UserID);

  if (data) {
    return data.Item;
  }

  return data;
}

async function create(data) {
  return await lessonRepository.create({
   ...data
  });
}

async function update(UserID, data) {
  return await lessonRepository.update(UserID, {
    Username: data.Username,
  });
}

async function deleteByID(UserID) {
  return await lessonRepository.deleteByID(UserID);
}

export default {
    findAll,
  findByID,
  create,
  update,
  deleteByID,
};
