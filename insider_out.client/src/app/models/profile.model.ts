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
    userId: number;
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userPhone?: string;
    userDepartment?: string;
}