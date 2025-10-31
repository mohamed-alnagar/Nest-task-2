import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Try importing this way
const { InjectModel } = require('@nestjs/mongoose');

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const created = new this.userModel(dto);
    return created.save();
  }

  async update(id: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async delete(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('User not found');
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
