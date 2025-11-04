export interface ProfileModel {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface UserModel extends ProfileModel {
    userId: number;

}

export interface SubjectModel extends ProfileModel {
    subjectId: number;
    department?: string;
}
