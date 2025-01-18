export interface EventData {
    name: string;
    description: string;
    numOfParticipants: number;
    numOfTeams: number;
    dateOfEvent: string;
    createdAt: string;
    location: string;
    eventStatus: string;
    eventType: string;
    eventURL: string;
    organizer: string;
    tags: string[];
};

export interface Cell {
    row: number;
    col: number;
    type: 'table' | 'aisle';
    walkable: boolean;
    team?: any;
}