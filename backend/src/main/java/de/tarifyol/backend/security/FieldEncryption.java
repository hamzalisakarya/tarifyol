package de.tarifyol.backend.security;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public final class FieldEncryption {
    private static final String PREFIX = "enc:v1:";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;
    private static final SecureRandom RANDOM = new SecureRandom();

    private FieldEncryption() { }

    public static void validateKey() {
        key();
    }

    public static String encrypt(String value) {
        if (value == null || value.isBlank()) return value;
        try {
            byte[] iv = new byte[IV_LENGTH];
            RANDOM.nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, key(), new GCMParameterSpec(TAG_LENGTH, iv));
            byte[] encrypted = cipher.doFinal(value.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            byte[] packed = new byte[iv.length + encrypted.length];
            System.arraycopy(iv, 0, packed, 0, iv.length);
            System.arraycopy(encrypted, 0, packed, iv.length, encrypted.length);
            return PREFIX + Base64.getEncoder().encodeToString(packed);
        } catch (Exception e) {
            throw new IllegalStateException("Could not encrypt customer data.", e);
        }
    }

    public static String decrypt(String value) {
        if (value == null || value.isBlank()) return value;
        if (!value.startsWith(PREFIX)) {
            throw new IllegalStateException("Unencrypted sensitive data found. Refusing to expose it.");
        }
        try {
            byte[] packed = Base64.getDecoder().decode(value.substring(PREFIX.length()));
            byte[] iv = java.util.Arrays.copyOfRange(packed, 0, IV_LENGTH);
            byte[] ciphertext = java.util.Arrays.copyOfRange(packed, IV_LENGTH, packed.length);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, key(), new GCMParameterSpec(TAG_LENGTH, iv));
            return new String(cipher.doFinal(ciphertext), java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Could not decrypt customer data. Check the encryption key.", e);
        }
    }

    private static SecretKeySpec key() {
        String encoded = System.getenv("TARIFYOL_FIELD_ENCRYPTION_KEY");
        if (encoded == null || encoded.isBlank()) {
            throw new IllegalStateException("TARIFYOL_FIELD_ENCRYPTION_KEY must be set.");
        }
        try {
            byte[] bytes = Base64.getDecoder().decode(encoded);
            if (bytes.length != 32) throw new IllegalArgumentException("Expected 32 bytes.");
            return new SecretKeySpec(bytes, "AES");
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("TARIFYOL_FIELD_ENCRYPTION_KEY must be Base64 for exactly 32 random bytes.", e);
        }
    }
}
