import { ObjectId } from "mongodb";

export interface ServiceType {
  _id?: ObjectId;
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminUser {
  _id?: ObjectId;
  username: string;
  password: string;
  createdAt: Date;
}
