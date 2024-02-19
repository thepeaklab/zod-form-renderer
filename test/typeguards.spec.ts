import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  isBoolean,
  isDate,
  isEnum,
  isNumber,
  isString,
  isZodEffects,
} from "../src/typeguards";

describe("Typeguards", () => {
  describe("isZodEffects", () => {
    it("should return true if the value is a ZodEffects", () => {
      const value = z.string().refine((s) => s.startsWith("A"));
      expect(isZodEffects(value)).toBe(true);
    });

    it("should return false if the value is not a ZodEffects", () => {
      const value = z.string();
      expect(isZodEffects(value)).toBeFalsy();
    });

    it("should return true if the value is an optional ZodEffects", () => {
      const value = z
        .string()
        .refine((s) => s.startsWith("A"))
        .optional();

      expect(isZodEffects(value)).toBe(true);
    });

    it("should return true if the value is a nullable ZodEffects", () => {
      const value = z
        .string()
        .refine((s) => s.startsWith("A"))
        .nullable();
      expect(isZodEffects(value)).toBe(true);
    });
  });

  describe("isString", () => {
    it("should return true if the value is a ZodString", () => {
      const value = z.string();
      expect(isString(value)).toBe(true);
    });

    it("should return false if the value is not a ZodString", () => {
      const value = z.number();
      expect(isString(value)).toBeFalsy();
    });

    it("should return true if the value is an optional ZodString", () => {
      const value = z.string().optional();
      expect(isString(value)).toBe(true);
    });

    it("should return true if the value is a nullable ZodString", () => {
      const value = z.string().nullable();
      expect(isString(value)).toBe(true);
    });

    it("should return true if the value is a ZodString with effects", () => {
      const value = z.string().refine((s) => s.startsWith("A"));
      expect(isString(value)).toBe(true);
    });
  });

  describe("isNumber", () => {
    it("should return true if the value is a ZodNumber", () => {
      const value = z.number();
      expect(isNumber(value)).toBe(true);
    });

    it("should return false if the value is not a ZodNumber", () => {
      const value = z.string();
      expect(isNumber(value)).toBeFalsy();
    });

    it("should return true if the value is an optional ZodNumber", () => {
      const value = z.number().optional();
      expect(isNumber(value)).toBe(true);
    });

    it("should return true if the value is a nullable ZodNumber", () => {
      const value = z.number().nullable();
      expect(isNumber(value)).toBe(true);
    });

    it("should return true if the value is a ZodNumber with effects", () => {
      const value = z.number().refine((n) => n !== 2);
      expect(isNumber(value)).toBe(true);
    });
  });

  describe("isBoolean", () => {
    it("should return true if the value is a ZodBoolean", () => {
      const value = z.boolean();
      expect(isBoolean(value)).toBe(true);
    });

    it("should return false if the value is not a ZodBoolean", () => {
      const value = z.string();
      expect(isBoolean(value)).toBeFalsy();
    });

    it("should return true if the value is an optional ZodBoolean", () => {
      const value = z.boolean().optional();
      expect(isBoolean(value)).toBe(true);
    });

    it("should return true if the value is a nullable ZodBoolean", () => {
      const value = z.boolean().nullable();
      expect(isBoolean(value)).toBe(true);
    });

    it("should return true if the value is a ZodBoolean with effects", () => {
      const value = z.boolean().refine((b) => b === true);
      expect(isBoolean(value)).toBe(true);
    });
  });

  describe("isEnum", () => {
    it("should return true if the value is a ZodEnum", () => {
      const value = z.enum(["A", "B", "C"]);
      expect(isEnum(value)).toBe(true);
    });

    it("should return false if the value is not a ZodEnum", () => {
      const value = z.string();
      expect(isEnum(value)).toBeFalsy();
    });

    it("should return true if the value is an optional ZodEnum", () => {
      const value = z.enum(["A", "B", "C"]).optional();
      expect(isEnum(value)).toBe(true);
    });

    it("should return true if the value is a nullable ZodEnum", () => {
      const value = z.enum(["A", "B", "C"]).nullable();
      expect(isEnum(value)).toBe(true);
    });

    it("should return true if the value is a ZodEnum with effects", () => {
      const value = z.enum(["A", "B", "C"]).refine((e) => e !== "A");
      expect(isEnum(value)).toBe(true);
    });
  });

  describe("isDate", () => {
    it("should return true if the value is a ZodDate", () => {
      const value = z.date();
      expect(isDate(value)).toBe(true);
    });

    it("should return false if the value is not a ZodDate", () => {
      const value = z.string();
      expect(isDate(value)).toBeFalsy();
    });

    it("should return true if the value is an optional ZodDate", () => {
      const value = z.date().optional();
      expect(isDate(value)).toBe(true);
    });

    it("should return true if the value is a nullable ZodDate", () => {
      const value = z.date().nullable();
      expect(isDate(value)).toBe(true);
    });

    it("should return true if the value is a ZodDate with effects", () => {
      const value = z.date().refine((d) => d > new Date());
      expect(isDate(value)).toBe(true);
    });
  });
});
