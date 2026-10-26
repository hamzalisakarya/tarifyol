package de.tarifyol.backend.config;

import de.tarifyol.backend.security.FieldEncryption;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FieldEncryptionConfiguration {
    @Bean
    InitializingBean validateFieldEncryptionKey() {
        return FieldEncryption::validateKey;
    }
}
