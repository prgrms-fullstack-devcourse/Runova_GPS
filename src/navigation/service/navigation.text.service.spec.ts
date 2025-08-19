import { NavigationTextService } from './navigation.text.service';
import { ConfigService } from '@nestjs/config';

function makeConfig(threshold?: number): ConfigService {
    return {
        // Only the method we use needs to exist
        get: jest.fn((key: string) => {
            if (key === 'GIS_STRAIGHT_THRESHOLD_DEGREE') return threshold;
            return undefined;
        }),
    } as unknown as ConfigService;
}

// Helper to normalize multiline template strings in assertions
const squash = (s: string) => s.replace(/\s+/g, ' ').trim();

describe('NavigationTextService', () => {
    describe('makeWarning', () => {
        it('tells to turn LEFT and U-TURN if theta > 150', () => {
            const svc = new NavigationTextService(makeConfig());
            const msg = svc.makeWarning(80, 170);

            expect(squash(msg)).toBe(
                squash('경로에서 벗어났습니다. 왼쪽으로 유턴 후 80m 이동해주세요!')
            );
        });

        it('tells to turn RIGHT and 회전 if theta negative and <= 150', () => {
            const svc = new NavigationTextService(makeConfig());
            const msg = svc.makeWarning(25, -90);

            expect(squash(msg)).toBe(
                squash('경로에서 벗어났습니다. 오른쪽으로 회전 후 25m 이동해주세요!')
            );
        });
    });

    describe('makeInstruction', () => {
        it('returns empty when delta is within default threshold (30°)', () => {
            const svc = new NavigationTextService(makeConfig()); // default threshold 30
            // delta = (20 - 10 + 540) % 360 - 180 = 10
            expect(svc.makeInstruction(10, 20)).toBe('');
            // crossing 360 boundary, still small delta (20°)
            expect(svc.makeInstruction(350, 10)).toBe('');
        });

        it('respects custom threshold from config', () => {
            const svc = new NavigationTextService(makeConfig(45)); // threshold 45
            // delta = 40 -> below 45 -> empty
            expect(svc.makeInstruction(0, 40)).toBe('');
            // delta = 50 -> above 45 -> instruction
            const msg = svc.makeInstruction(0, 50);
            expect(squash(msg)).toBe(
                squash('잠시후 왼쪽으로 회전 있습니다. 앱을 확인해 주세요')
            );
        });

        it('produces LEFT 회전 for positive delta above threshold', () => {
            const svc = new NavigationTextService(makeConfig()); // threshold 30
            // delta = (60 - 0 + 540) % 360 - 180 = 60
            const msg = svc.makeInstruction(0, 60);
            expect(squash(msg)).toBe(
                squash('잠시후 왼쪽으로 회전 있습니다. 앱을 확인해 주세요')
            );
        });

        it('produces RIGHT 유턴 for large negative delta (e.g., -160°)', () => {
            const svc = new NavigationTextService(makeConfig()); // threshold 30
            // delta = (200 - 0 + 540) % 360 - 180 = -160
            const msg = svc.makeInstruction(0, 200);
            expect(squash(msg)).toBe(
                squash('잠시후 오른쪽으로 유턴 있습니다. 앱을 확인해 주세요')
            );
        });

        it('handles exact -180° as RIGHT 유턴', () => {
            const svc = new NavigationTextService(makeConfig()); // threshold 30
            // delta = (20 - 200 + 540) % 360 - 180 = -180
            const msg = svc.makeInstruction(200, 20);
            expect(squash(msg)).toBe(
                squash('잠시후 오른쪽으로 유턴 있습니다. 앱을 확인해 주세요')
            );
        });
    });
});