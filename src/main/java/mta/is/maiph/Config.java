package mta.is.maiph;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class Config implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//            String current = new java.io.File(".").getCanonicalPath();
//            System.out.println("Current dir:" + current);
        String currentDir = System.getProperty("user.dir");
        System.out.println("Current dir using System:" + currentDir);
        currentDir = currentDir.replace(File.separatorChar, '/');
        System.out.println("Current dir using System:" + currentDir);
//            Path currentRelativePath = Paths.get("");
//            String s = currentRelativePath.toAbsolutePath().toString();
//            System.out.println("Current relative path is: " + s);
        registry
                .addResourceHandler("/**")
                .addResourceLocations("file:///" + currentDir + "/application/");
        registry
                .addResourceHandler("/file/**")
                .addResourceLocations("file:///" + currentDir + "/file/");

    }
}
