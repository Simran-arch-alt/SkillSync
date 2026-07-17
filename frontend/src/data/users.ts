export interface User{
    id:string;
    name:string,
    email:string,

    careerGoal:string,
    qualifications:string,
    completion:number,
    cvUploaded:boolean,
    status: "Active"|"Inactive",
    lastLogin:string;
}
export const users:User[] = [
    {
        id:'1',
        name:'John Doe',
        email:'john.doe@example.com',
        careerGoal:'Software Engineer',
        qualifications:'BSc in Computer Science',
        completion:80,
        cvUploaded:true,
        status:'Active',
        lastLogin:'2 hours ago',
    },
    {
        id:'2',
        name:'Jane Smith',
        email:'jane.smith@example.com',
        careerGoal:'Data Scientist',
        qualifications:'MSc in Data Science',
        completion:90,
        cvUploaded:true,
        status:'Active',
        lastLogin:'1 day ago',
    }
];

