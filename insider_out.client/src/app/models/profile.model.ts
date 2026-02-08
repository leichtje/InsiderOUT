export interface ProfileModel {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department?: string;
}

export interface UserModel extends ProfileModel {
    userId: number;
}

export interface SubjectModel extends ProfileModel {
    subjectId: number;
    riskScore: number;
    role?: string;
    department?: string;
}

export interface UserDto {
    UserId: number;
    UserFirstName: string;
    UserLastName: string;
    UserEmail: string;
    UserPhone?: string;
    UserDepartment?: string;
}