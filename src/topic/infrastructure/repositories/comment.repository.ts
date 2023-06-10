import { Comment } from '../../domain/models/comment';

export abstract class CommentRepository {
  abstract save(comment: Comment): Promise<Comment>;
}
