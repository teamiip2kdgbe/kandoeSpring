import {Person} from "./person";
import {Address} from "./address";
/**
 * Created by amy on 16/02/2016.
 */
export class User {
    public username: string;
    public password: string;
    public passwordConfirm: string;
    public oldPassword: string;
    public email: string;
    public person: Person;
	public facebookAccount: boolean;
    public profilePicture: string;
    public position: number;
    public userId: number;

    constructor(){

    }

    static createEmpty(): User{
        var user =new User;
        var person = new Person();
        var address = new Address();
        person.address = address;
        user.person = person;
        return user;
    }

    static fromJson(json: any): User {
        var user = new User();
        user.username = json.username;
        user.email = json.email;
        user.profilePicture=json.profilePicture;
        user.userId=json.userId;

        user.person = new Person();
        if(json.person){
            user.person = Person.fromJson(user.person);
        }

        if(json.facebookAccount){
            user.facebookAccount = json.facebookAccount;
        }

        user.position = json.position;

        return user;
    }
}