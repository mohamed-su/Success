package comite.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/file-manager")
    public String fileManager() {
        return "file-manager.html";
    }
}