package comite.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan(basePackages = {"comite.demo.entity"})
@ComponentScan(basePackages = {"comite.demo.controller", "comite.demo.config", "comite.demo.repository", "comite.demo.service"})
public class DemoApplicationMinimal {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplicationMinimal.class, args);
    }
}