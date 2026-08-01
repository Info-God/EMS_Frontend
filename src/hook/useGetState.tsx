// hooks/usePusherTaskUpdates.ts
import { useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAppDispatch, useAppSelector } from '../lib/store/store';
import { updateArticleFromPusher, updatePeerReviewStatus, updateTaskStatus } from '../lib/store/features/submission';
import { updateWorkflowPeerReviewStatus, updateWorkflowTaskStatus } from '../lib/store/features/workflowSlice';
import type { ArticleUpdatePayload } from '../types';

window.Pusher = Pusher;
type socketEvent = {
    article_id: number;
    task_name: string;
    step_name?: string;
    new_status: "In progress" | "Completed" | "Deferred" | "Editor approval" | "Not Started";
};
export default function usePusherTaskUpdates(id?: string) {
    const dispatch = useAppDispatch();
    const { activePaperId } = useAppSelector(s => s.global);
    const activeId = id ?? activePaperId;
    useEffect(() => {
        if (!activeId) return;

        const echo = new Echo({
            broadcaster: 'pusher',
            key: '596eed13a8d67068de73',
            cluster: 'ap2',
            forceTLS: true
        });

        echo.channel(`article.${activeId}`)
            .listen('.task.updated', (data: socketEvent) => {
                //->console.log("Task Update:", data);

                // Update Redux state
                dispatch(updateTaskStatus({
                    task_name: data.task_name,
                    status: data.new_status
                }));
                dispatch(updateWorkflowTaskStatus({
                    task_name: data.task_name,
                    status: data.new_status
                }));
            })
            .listen('.peerreview.updated', (data: socketEvent) => {
                //->console.log("Peer Review Update:", data);

                dispatch(updatePeerReviewStatus({
                    step_name: data.step_name || '',
                    status: data.new_status
                }))
                dispatch(updateWorkflowPeerReviewStatus({
                    step_name: data.step_name || '',
                    status: data.new_status
                }))
                
            })
            .listen('.article.updated', (data: ArticleUpdatePayload) => {
                //->console.log('Realtime Article Update:', data);
                dispatch(updateArticleFromPusher(data))
            });

        return () => {
            echo.leave(`article.${activeId}`);
        };

    }, [activeId, dispatch]);
}