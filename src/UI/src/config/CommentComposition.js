import CommentMockService from '@coffeeshop/comment-mock-service';
import CommentController from '../Controllers/CommentController';

// Para conectar la API real en producción, únicamente se cambia la fuente:
// import CommentClient from '../../../../src/Application/Clients/CommentClient.mjs';
// const commentDataSource = new CommentClient({ baseUrl: '/api' });
const commentDataSource = new CommentMockService();

const commentController = new CommentController(commentDataSource);

export {
    commentController,
    commentDataSource
};
