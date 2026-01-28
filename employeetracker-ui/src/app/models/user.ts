import { last } from 'rxjs';

export class User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  role?: string;
  title?: string;
  salary?: string;
  phone?: string;

  constructor(
    id: number = 0,
    email: string = '',
    firstName: string = '',
    lastName: string = '',
    department: string = '',
    role: string = '',
    title: string = '',
    salary: string = '',
    phone: string = ''
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.department = department;
    this.role = role;
    this.title = title;
    this.salary = salary;
    this.phone = phone;
  }
}
