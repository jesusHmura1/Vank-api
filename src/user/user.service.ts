import { HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from 'src/common/interface/user.interfaces';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER } from 'src/common/models/models';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async created(userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUser = new this.model({ ...userDTO, password: hash });
    return await newUser.save();
  }

  async findeAll(): Promise<IUser[]> {
    return await this.model.find();
  }

  async findeOne(id: string): Promise<IUser> {
    return await this.model.findById(id);
  }

  async update(id: string, userDTO: UserDTO): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const user = { ...userDTO, password: hash };
    return await this.model.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return { status: HttpStatus.OK, msg: 'elemento eliminado con exito' };
  }

  async findByUserName(username: string) {
    return await this.model.findOne({ username });
  }

  async checkPassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }
}
