import { Routes } from '@angular/router';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { EmailComponent } from './pages/email/email.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path : '',
        component : RoadmapComponent
    },
    
    {
        path:'conversation',
        component:ConversationComponent
    },

    {
        path:'email-generator',
        component:EmailComponent
    },

    {
        path:'dashboard',
        component: DashboardComponent
    }
];
