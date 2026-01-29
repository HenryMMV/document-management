import { HttpResponse, successResponse } from './http-response';

interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export class HealthController {
  async check(): Promise<HttpResponse<HealthResponse>> {
    const payload: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };

    return successResponse(200, payload);
  }
}
