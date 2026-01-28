export class RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  role?: string;
  title?: string;
  salary?: string;
  phone?: string;

  constructor(
    email: string = '',
    password: string = '',
    firstName: string = '',
    lastName: string = '',
    department: string = '',
    role: string = '',
    title: string = '',
    salary: string = '',
    phone: string = '',
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.department = department;
    this.role = role;
    this.title = title;
    this.salary = salary;
    this.phone = phone;
  }
}
