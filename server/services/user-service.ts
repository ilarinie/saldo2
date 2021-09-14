import UserModel from '../models/User';
import constants from '../__test__/constants';

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
    // @ts-ignore
    user.name = name;
    // @ts-ignore
    user.picture = picture;
    user = await user.save();
  }
  return user;
};

const findOrCreateTestUser = async () => {
  let user;
  user = await UserModel.findById(constants.TEST_USER_ID);
  if (!user) {
    user = await UserModel.create({
      name: 'test_user',
      picture: 'https://asdasdasd',
      _id: constants.TEST_USER_ID,
    });
  }
  return user;
};

export {
  create,
  findById,
  findOrCreateFromGoogleProfile,
  findOrCreateTestUser,
};
