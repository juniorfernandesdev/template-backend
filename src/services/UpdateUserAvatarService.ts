import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can chance avatar.');
    }

    if (user.avatar) {
      // deletar avatar anterio
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFIlesExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFIlesExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
