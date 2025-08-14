import { DateTimeFormatter, LocalTime, nativeJs } from "@js-joda/core";

export function expectTimeToBeTaken(length: number, speed: number): string {

    const t: LocalTime = nativeJs(
        new Date((length / speed) * 1000)
    ).toLocalTime();

    return t.format(
        DateTimeFormatter.ofPattern("HH:mm:ss")
    );
}


