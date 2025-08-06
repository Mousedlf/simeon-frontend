export interface UserProfile {
    id: number;
    username: string;
    email: string;
    public: boolean;
    created_at: Date;
    image_src: string;
}
