export interface Patient {
    id: string;
    arrival_time: string;
    triage_category: number;
    queue_position: {
      global: number;
      category: number;
    };
    status: {
      current_phase: string;
      investigations?: {
        labs: string;
        imaging: string;
      };
    };
    time_elapsed: number;
}

export interface QueueResponse {
    waitingCount: number;
    longestWaitTime: number;
    patients: Patient[];
}

export interface Stats {
    categoryBreakdown: { [key: number]: number };
    averageWaitTimes: { [key: number]: number };
}
