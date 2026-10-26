package de.tarifyol.backend.security;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class SensitiveStringConverter implements AttributeConverter<String, String> {
    @Override
    public String convertToDatabaseColumn(String value) {
        return FieldEncryption.encrypt(value);
    }

    @Override
    public String convertToEntityAttribute(String value) {
        return FieldEncryption.decrypt(value);
    }
}
