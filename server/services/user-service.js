const UserModel = require('../models/User');
const { TEST_USER_ID } = require('../__test__/constants');

const create = async () => {};

const findById = async (_id) => {
  return await UserModel.findById(_id);
};

const findOrCreateFromGoogleProfile = async (googleProfile) => {
  const { sub, picture, name } = googleProfile._json;
  let user = await UserModel.findOne({ googleProfileId: sub });
  if (!user) {
    const newUser = {
      name,
      picture,
      googleProfileId: sub,
    };
    user = await UserModel.create(newUser);
  } else {
    user.name = name;
    user.picture = picture;
    user = await user.save();
  }
  return user;
};

const findOrCreateTestUser = async () => {
  let user;
  user = await UserModel.findById(TEST_USER_ID);
  if (!user) {
    user = await UserModel.create({
      name: 'test_user',
      picture: 'https://asdasdasd',
      _id: TEST_USER_ID,
    });
  }
  return user;
};

module.exports = {
  create,
  findById,
  findOrCreateFromGoogleProfile,
  findOrCreateTestUser,
};
