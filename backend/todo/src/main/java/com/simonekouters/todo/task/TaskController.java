package com.simonekouters.todo.task;

import com.simonekouters.todo.exceptions.BadRequestException;
import com.simonekouters.todo.exceptions.NotFoundException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RequiredArgsConstructor
@Component
@RestController
@RequestMapping("api/v1/tasks")
@Getter
@Setter
public class TaskController {
    private final TaskRepository taskRepository;
    @PostMapping
    public ResponseEntity<Task> addTask(@RequestBody PostTaskDto postTaskDto, UriComponentsBuilder ucb) {
        if (postTaskDto.text() == null) {
            throw new BadRequestException("Text can't be null");
        }
        if (postTaskDto.index() == null) {
            throw new BadRequestException("Order can't be null");
        }
        Task newTask = new Task(postTaskDto.text(), postTaskDto.index());
        taskRepository.save(newTask);
        URI locationOfNewTask = ucb.path("items/{id}").buildAndExpand(newTask.getId()).toUri();
        return ResponseEntity.created(locationOfNewTask).body(newTask);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTask(@PathVariable Long id) {
        var possiblyExistingTask = taskRepository.findById(id);
        if (possiblyExistingTask.isEmpty()) {
            throw new NotFoundException();
        }
        Task task = possiblyExistingTask.get();
        return ResponseEntity.ok(TaskDto.from(task));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody PatchTaskDto patchTaskDto) {
        var possiblyExistingTask = taskRepository.findById(id);
        if (possiblyExistingTask.isEmpty()) {
            throw new NotFoundException();
        }
        Task task = possiblyExistingTask.get();

        if (patchTaskDto.done() != null) {
            task.setDone(patchTaskDto.done());
        }
        if (patchTaskDto.text() != null) {
            task.setText(patchTaskDto.text());
        }
        if (patchTaskDto.index() != null) {
            task.setIndex(patchTaskDto.index());
        }

        taskRepository.save(task);
        return ResponseEntity.ok(TaskDto.from(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        var possiblyExistingTask = taskRepository.findById(id);
        if (possiblyExistingTask.isEmpty()) {
            throw new NotFoundException();
        }
        Task task = possiblyExistingTask.get();
        task.setEnabled(false);
        taskRepository.save(task);
        return ResponseEntity.noContent().build();
    }
}
