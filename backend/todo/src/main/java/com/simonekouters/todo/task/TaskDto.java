package com.simonekouters.todo.task;

public record TaskDto(Long id, String text, Integer index, Boolean enabled, Boolean done) {
    public static TaskDto from(Task task) {
        return new TaskDto(task.getId(), task.getText(), task.getIndex(), task.isEnabled(), task.isDone());
    }
}
