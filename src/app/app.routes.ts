import { Routes } from '@angular/router';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';

export const routes: Routes = [
    {
        path : '',
        component : RoadmapComponent
    },
    
    {
        path:'conversation',
        component:ConversationComponent
    }
];
