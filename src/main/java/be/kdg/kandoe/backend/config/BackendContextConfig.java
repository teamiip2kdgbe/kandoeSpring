package be.kdg.kandoe.backend.config;

import org.springframework.context.annotation.*;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan(basePackages = "be.kdg.kandoe.backend",
        excludeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,
                value = Configuration.class)}
)
@EnableJpaRepositories(basePackages = "be.kdg.kandoe.backend.persistence")
@Import({DataSourceConfig.class, EntityTransactionManagerConfig.class})
public class BackendContextConfig {

}
