import bookRepository from "../repository/books.repository.js";

async function findAll() {
  const data = await bookRepository.getAll();

  if (data) {
    return data;
  }

  return data;
}
async function findByIDAndLastPull({ bookID, last_pulled_at }) {
  const data = await bookRepository.getByIdLastPullChange(
    bookID,
    last_pulled_at
  );

  if (data) {
    return data;
  }

  return data;
}
async function findByID(id_user) {
  const data = await bookRepository.findByID(id_user);

  if (data) {
    return data.Item;
  }

  return data;
}

async function create(data) {
  data.created_at = Date.now();
  data.updated_at = null;
  data.last_pulled_at = null;

  console.log(data)

  return await bookRepository.create({
    ...data,
  });
}

async function update(UserID, data) {
  return await bookRepository.update(UserID, {
    ...data,
  });
}

async function deleteByID(UserID) {
  return await bookRepository.deleteByID(UserID, Date.now());
}

export default {
  findByIDAndLastPull,
  findAll,
  findByID,
  create,
  update,
  deleteByID,
};
