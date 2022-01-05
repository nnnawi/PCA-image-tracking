var covariance_matrix;
var apply_matrix_boolean = false;
var apply_matrix_arrow_boolean = false;
var reset_matrix_boolean = false;
var reset_matrix_arrow_boolean = false;
var reset_canvas_boolean = false;
var reset_covariance_boolean = false;

var apply_matrix = function(p){

    var vector_array = [];
    var new_vector_array = [];
    var vector_number_array = [];
    var applied_matrix;
    var transition_state = false;

    p.setup = function(){
        p.createCanvas(500,500);

        var number_of_vector = 1000;
        var size = 100;

        for(i = 0;i < number_of_vector;i++){
            var angle = 2*p.PI*i/number_of_vector;
            var current_vector = p5.Vector.fromAngle(angle).mult(size);
            vector_array.push(current_vector);
        }
        
        applied_matrix = math.matrix([[2,1],[-2,1]]);
    }

    p.draw = function(){
        p.background(220);
        p.push();
        p.translate(p.width/2,p.height/2);
        p.noStroke();
        p.fill(0,0,200,100);
        for(i = 0;i < vector_array.length;i++){
            var current_vector = vector_array[i];
            p.ellipse(current_vector.x,current_vector.y,10,10);
        }

        if(transition_state){
            for(i=0;i < vector_number_array.length;i++){
                var vector_index = vector_number_array[i];
                var current_vector = vector_array[vector_index];
                var current_target_vector = new_vector_array[vector_index];
                var vector_difference = p5.Vector.sub(current_target_vector,current_vector);
                var distance = vector_difference.mag();
                if(distance > 0.01){
                    var added_vector = vector_difference.mult(0.06);
                    vector_array[vector_index].add(added_vector);
                }
                else{
                    vector_number_array.splice(vector_index,1);
                }
            }
            if(vector_number_array.length <= 0){
                transition_state = false;
            }
        }
        p.pop();
        if(apply_matrix_boolean){
            p.interaction();
            apply_matrix_boolean = false;
        }
        if(reset_matrix_boolean){
            p.reset_arrays();
            reset_matrix_boolean = false;
        }
        p.draw_axis(4);
    }

    p.draw_axis = function(precision){
        p.stroke(150);
        p.strokeWeight(2);
        p.line(0,p.height/2,p.width,p.height/2);
        p.line(p.width/2,0,p.width/2,p.height);
        var text_value = -xy_lim;
        for(i = 1; i < 2*precision; i++){
            var xy_step = p.width/precision*0.5;
            text_value += xy_lim / precision;
            p.stroke(150);
            p.strokeWeight(2);
            p.line(xy_step*i,p.height/2 + 5,xy_step*i,p.height/2 - 5);
            p.line(p.width/2 + 5,xy_step*i,p.width/2 - 5,xy_step*i);
            p.fill(0);
            p.noStroke();
            if(text_value != 0){
                p.text(p.str(text_value.toFixed(2)),p.width/2 + 15,p.height - xy_step*i + 3);
                p.text(p.str(text_value.toFixed(2)),xy_step*i - 12,p.height/2 + 20);
            }
        }
    }

    p.apply_matrix_function = function(){
        var a = parseFloat(document.getElementById("a1").value);
        var b = parseFloat(document.getElementById("b1").value);
        var c = parseFloat(document.getElementById("c1").value);
        var d = parseFloat(document.getElementById("d1").value);

        applied_matrix = math.matrix([[a,b],[c,d]]);

        for(i = 0;i < vector_array.length;i++){
            var current_vector = vector_array[i];
            var linked_matrix = math.matrix([[current_vector.x],[current_vector.y]]);
            var new_vector = math.multiply(applied_matrix,linked_matrix);
            new_vector = new_vector._data;
            var new_p5_vector = p.createVector(new_vector[0][0],new_vector[1][0]);
            new_vector_array[i] = new_p5_vector;
        }
    }

    p.interaction = function(){
        p.apply_matrix_function();
        for(i = 0;i < vector_array.length;i++){
            vector_number_array[i] = i;
        }
        transition_state = true;
    }

    p.reset_arrays = function(){
        for(i = 0;i < vector_array.length; i++){
            var angle = 2*p.PI*i/vector_array.length;
            var current_vector = p5.Vector.fromAngle(angle).mult(100);
            vector_array[i] = current_vector.copy();
            new_vector_array[i] = current_vector.copy();
        }
    }
}
var myp5 = new p5(apply_matrix,'apply_matrix');

var computing_covariance = function(p){
    var vector_array = [p.createVector(0,0)];
    var vector_array_drawn = [p.createVector(0,0)];
    var millis_buffer = 0;
    var covariance = 0;
    var correlation = 0;

    p.setup = function(){
        p.createCanvas(500,500);
    }

    p.draw = function(){
        p.background(220);
        p.noStroke();
        p.fill(255,255,0,180);
        for(i = 0;i < vector_array.length;i++){
            var current_vector = vector_array_drawn[i];
            p.ellipse(current_vector.x,current_vector.y,10,10);
        }
        p.drawAxis();
        p.updateCovarianceDisplay();
        if(reset_covariance_boolean){
            vector_array_drawn = [];
            vector_array = [];
            covariance = 0;
            reset_covariance_boolean  = false;
        }
    }

    p.drawAxis = function(){
        p.stroke(100);
        p.strokeWeight(2);
        p.line(p.width/2,0,p.width/2,p.height);
        p.line(0,p.height/2,p.width,p.height/2);
        for(i = 1;i < 10; i++){
            var step = p.width/10;
            var text_value = -1 + i/5;
            p.stroke(100);
            p.strokeWeight(2);
            p.line(p.width/2 - 5,step*i,p.width/2 + 5,step*i);
            p.line(step*i,p.height/2 + 5,step*i,p.height/2 - 5);
            p.noStroke();
            p.fill(0);
            if(text_value != 0){
                p.text(p.str(text_value.toFixed(2)),p.width/2 + 15,p.height - step*i + 3);
                p.text(p.str(text_value.toFixed(2)),step*i - 12,p.height/2 + 20);
            }
        }
    }

    p.updateCovarianceDisplay = function(){
        var wrapper = document.getElementById("covariance_output");
        wrapper.innerHTML = covariance.toFixed(4);
    }

    p.mouseDragged = function(){
        if(p.millis() - millis_buffer > 30){
            var mouse_vector = p.createVector(p.mouseX,p.mouseY);
            if(p.inScreen(mouse_vector)){
                for(i = 0;i < 10;i++){
                    var distance = p.random(10,50);
                    var angle = p.random(0,360);
                    var new_vector = p5.Vector.fromAngle(p.radians(angle)).mult(distance).add(mouse_vector);
                    vector_array_drawn.push(new_vector.copy());
                    new_vector.x = p.map(new_vector.x,0,p.width,-1,1);
                    new_vector.y = p.map(new_vector.y,0,p.height,1,-1);
                    vector_array.push(new_vector);
                }
                millis_buffer = p.millis();
            }
        }
        p.compute_covariance();
    }

    p.inScreen = function(input_vector){
        return (input_vector.x > 0 && input_vector.x < p.width && input_vector.y > 0 && input_vector.y < p.height);
    }

    p.compute_covariance = function(){
        var x_mean = 0;
        var y_mean = 0;
        for(i = 0;i < vector_array.length;i++){
            var current_vector = vector_array[i];
            x_mean += current_vector.x;
            y_mean += current_vector.y;
        }
        x_mean /= vector_array.length;
        y_mean /= vector_array.length;

        var x_variance = 0;
        var y_variance = 0;

        for(i = 0;i < vector_array.length;i++){
            var current_vector = vector_array[i];
            covariance += (current_vector.x - x_mean)*(current_vector.y - y_mean);
            x_variance += p.pow(current_vector.x - x_mean,2);
            y_variance += p.pow(current_vector.y - y_mean,2);
        }
        covariance /= vector_array.length;
        x_variance /= vector_array.length;
        y_variance /= vector_array.length;
    }
}
var myp5 = new p5(computing_covariance,'computing_covariance');

var circle_distribution = function(p){
    var vector_array = [];

    p.setup = function(){
        p.createCanvas(300,300);
        p.sample_circle_distribution();
    }

    p.draw = function(){
        p.background(200);
        p.noStroke();
        p.fill(0,0,255);
        p.translate(p.width/2,p.height/2);
        for(i=0;i < vector_array.length;i++){
            var current_vector = vector_array[i].copy().mult(50);
            p.ellipse(current_vector.x,current_vector.y,5,5);
        }
    }

    p.keyPressed = function(){
        if(p.key == "f"){
            p.apply_matrix_function();
        }
    }

    p.sample_circle_distribution = function(){
        var number = 1000;
        for(i = 0;i < number; i++){
            var random_radius = p.sqrt(p.random(0,1));
            var random_angle = 2 * p.PI * p.random(0,1);
            var new_vector = p5.Vector.fromAngle(random_angle).mult(random_radius);
            vector_array.push(new_vector);
        }
    }

    p.apply_matrix_function = function(){
        for(i=0;i < vector_array.length;i++){
            var current_vector = vector_array[i];
            var linked_matrix = math.matrix([[current_vector.x],[current_vector.y]]);
            var new_vector = math.multiply(covariance_matrix,linked_matrix);
            var new_vector = new_vector._data;
            var new_p5_vector = p.createVector(new_vector[0][0],new_vector[0][1]);
            vector_array[i] = new_p5_vector;
        }
    }
}

var draw_distribution = function(p){
    var vector_array = [];
    var eigenvectors = [];
    var x_mean = 0;
    var y_mean = 0;

    p.setup = function(){
        p.createCanvas(300,300);
    }

    p.draw = function(){
        p.background(200);
        p.noStroke();
        p.fill(255,255,0);
        for(i=0;i<vector_array.length;i++){
            var current_vector = vector_array[i];
            p.ellipse(current_vector.x,current_vector.y,10,10);
        }
        for(i=0;i < eigenvectors.length;i++){
            p.draw_vectors(50,eigenvectors[i]);
        }
    }

    p.inScreen = function(input_vector){
        return (input_vector.x > 0 && input_vector.x < p.width && input_vector.y > 0 && input_vector.y < p.height);
    }

    p.mouseDragged = function(){
        var mouseVector = p.createVector(p.mouseX,p.mouseY);
        if(p.inScreen(mouseVector)){
            vector_array.push(mouseVector);
        }
    }

    p.compute_covariance_matrix = function(){
        var covariance = 0;
        var variance_x = 0;
        var variance_y = 0;

        for(i=0;i<vector_array.length;i++){
            var current_vector = vector_array[i];
            x_mean += current_vector.x;
            y_mean += current_vector.y;
        }
        x_mean /= vector_array.length;
        y_mean /= vector_array.length;

        for(i=0;i<vector_array.length;i++){
            var current_vector = vector_array[i];
            variance_x += p.pow(current_vector.x - x_mean,2);
            variance_y += p.pow(current_vector.y - y_mean,2);
            covariance += (current_vector.x - x_mean)*(current_vector.y - y_mean);
        }
        variance_x /= vector_array.length;
        variance_y /= vector_array.length;
        covariance /= vector_array.length;

        covariance_matrix = math.matrix([[variance_x,covariance],[covariance,variance_y]]);
        covariance_matrix = math.multiply(covariance_matrix,1/10000);
        eigenvectors = math.eigs(covariance_matrix).values._data;

        console.log(eigenvectors);
    }

    p.keyPressed = function(){
        if(p.key == "g"){
            p.compute_covariance_matrix();
        }
    }

    p.draw_vectors = function(length,vector){
        p.stroke(255,0,0);
        p.strokeWeight(3);
        var mid_vector = p.createVector(x_mean,y_mean);
        var new_vector = p.createVector(vector[0],vector[1]).mult(length);
        new_vector.add(mid_vector);
        p.line(mid_vector.x,mid_vector.y,new_vector.x,new_vector.y);
    }
}

var apply_matrix_arrow = function(p){
    vector_circle = [];
    drawn_vector_circle = [];
    target_vector_circle = [];
    vector_index_array = [];
    eigenvectors = [];
    eigenvalues = [];
    xy_lim = 2;
    xy_lim_target = 2;
    vector_animation_state = false;
    xy_lim_animation_state = false;
    error_boolean = false;
    animation_speed = 5;
    eigenvectors_check = false;

    p.setup = function(){
        p.createCanvas(500,500);
        var vector_number = 50;
        for(i = 0;i < vector_number;i++){
            var angle = 2 * p.PI * i / vector_number;
            var current_vector = p5.Vector.fromAngle(angle);
            vector_circle.push(current_vector);
            drawn_vector_circle.push(current_vector);
        }
    }

    p.draw = function(){
        p.background(220);
        p.draw_axis(4);
        if(vector_animation_state){
            for(i = 0;i < vector_index_array.length; i++){
                var current_index = vector_index_array[i];
                var target_vector = target_vector_circle[current_index];
                var current_vector = drawn_vector_circle[current_index];
                var vector_difference = p5.Vector.sub(target_vector,current_vector);
                var vector_distance = vector_difference.mag();
                if(vector_distance > 0.001){
                    vector_difference.mult(animation_speed * 0.01);
                    var new_vector = p5.Vector.add(drawn_vector_circle[current_index],vector_difference);
                    drawn_vector_circle[current_index] = new_vector;
                }
                else{
                    vector_index_array.splice(current_index,1);
                }
            }
            if(vector_index_array.length <= 0){
                vector_animation_state = false;
            }
        }
        /*
        if(xy_lim_animation_state){
            var xy_lim_difference = xy_lim_target - xy_lim;
            if(p.abs(xy_lim_difference) > 0.01){
                xy_lim += xy_lim_difference*0.1;
            }
            else{
                xy_lim_animation_state = false;
            }
        }
        */
        p.translate(p.width/2,p.height/2);
        p.draw_circle_vector(drawn_vector_circle,p.width/(2 * xy_lim),p.color(0,0,255,100));
        
        
        if(error_boolean && eigenvectors_check){
            p.draw_eigenvectors();
        }
        
        if(apply_matrix_arrow_boolean){
            p.interaction();
            apply_matrix_arrow_boolean = false;
        }

        if(reset_matrix_arrow_boolean){
            p.reset_arrays();
            reset_matrix_arrow_boolean = false;
        }
    }

    p.draw_arrow = function(input_vector){
        p.strokeWeight(2);
        p.line(0,0,input_vector.x,input_vector.y);
        p.push();
        p.translate(input_vector.x,input_vector.y);
        p.rotate(input_vector.heading() + p.PI/2);
        p.line(0,0,-5,10);
        p.line(0,0,5,10),
        p.pop();
    }

    p.draw_circle_vector = function(array,multiplier,color){
        p.beginShape();
        for(i = 0;i < array.length;i++){
            var current_vector = p5.Vector.mult(array[i],multiplier);
            p.stroke(color);
            p.draw_arrow(current_vector,multiplier);
            p.noFill();
            p.vertex(current_vector.x,current_vector.y);
        }
        p.endShape(p.CLOSE);
    }

    p.update_boundaries = function(){
        var max_x = 0;
        var max_y = 0;
        for(i = 0;i < target_vector_circle.length; i++){
            var current_vector = target_vector_circle[i];
            if(current_vector.x > max_x){
                max_x = current_vector.x;
            }
            if(current_vector.y > max_y){
                max_y = current_vector.y;
            }
        }
        xy_lim_target = p.max(p.ceil(max_x),p.ceil(max_y)) * 2; //maybe time 2 so ellipse shape stay in the middle / DONE
        xy_lim_animation_state = true;
    }

    p.draw_axis = function(precision){
        p.stroke(150);
        p.strokeWeight(2);
        p.line(0,p.height/2,p.width,p.height/2);
        p.line(p.width/2,0,p.width/2,p.height);
        var text_value = -xy_lim;
        for(i = 1; i < 2*precision; i++){
            var xy_step = p.width/precision*0.5;
            text_value += xy_lim / precision;
            p.stroke(150);
            p.strokeWeight(2);
            p.line(xy_step*i,p.height/2 + 5,xy_step*i,p.height/2 - 5);
            p.line(p.width/2 + 5,xy_step*i,p.width/2 - 5,xy_step*i);
            p.fill(0);
            p.noStroke();
            p.text(p.str(text_value.toFixed(1)),xy_step*i,p.height/2 + 15);
            p.text(p.str(text_value.toFixed(1)),p.width/2 + 10,p.height - xy_step*i);
        }
    }

    p.apply_matrix = function(){
        xy_lim = 2;
        p.copy_array(vector_circle,drawn_vector_circle);
    
        var a = parseFloat(document.getElementById("a2").value);
        var b = parseFloat(document.getElementById("b2").value);
        var c = parseFloat(document.getElementById("c2").value);
        var d = parseFloat(document.getElementById("d2").value);
    
        var applied_matrix = math.matrix([[a,b],[c,d]]);
    
        for(i = 0;i < vector_circle.length; i++){
            var current_p5_vector = vector_circle[i];
            var current_math_vector = math.matrix([[current_p5_vector.x,current_p5_vector.y]]);
            var new_math_vector = math.multiply(current_math_vector,applied_matrix)._data[0];
            var new_p5_vector = p.createVector(new_math_vector[0],new_math_vector[1]);
            target_vector_circle[i] = new_p5_vector.copy();
        }
    
        for(i = 0;i < target_vector_circle.length; i++){
            vector_index_array[i] = i;
        }
    
        vector_animation_state = true;
        error_boolean = true;
        try {
            eigenobjects = math.eigs(applied_matrix);
            eigenvectors = eigenobjects.vectors._data;
            eigenvalues = eigenobjects.values._data;
        }
        catch(error){
            error_boolean = false;
            console.log("Matrix is not diagonalizable");
        }
    }

    p.copy_array = function(array1,array2){
        for(let i = 0;i < array1.length; i++){
            array2[i] = array1[i];
        }
    }

    p.draw_eigenvectors = function(){
        p.beginShape();
        p.rotate(p.PI/2);
        for(i = 0;i < eigenvectors.length; i++){
            var current_vector = eigenvectors[i];
            var current_p5_vector = p.createVector(current_vector[0],current_vector[1]).mult(p.width/(2 * xy_lim_target));
            p.stroke(255,0,0);
            p.draw_arrow(current_p5_vector);
        }
        p.endShape();
    }

    p.interaction = function(){
        p.apply_matrix();
        p.update_boundaries();
    }

    p.reset_arrays = function(){
        drawn_vector_circle = [];
        target_vector_circle = [];
        for(i = 0;i < vector_circle.length;i++){
            drawn_vector_circle.push(vector_circle[i]);
            target_vector_circle.push(vector_circle[i]);
        }
    }
}
var myp5 = new p5(apply_matrix_arrow,'apply_matrix_arrow');

var drawing_script = function(p){
    var grid = [];
    var grid_size = 100;
    var eigen_vectors = [];

    p.setup = function(){
        p.createCanvas(500,500);
        p.setup_grid(grid_size);
    }

    p.draw = function(){
        p.background(220);
        p.draw_grid();
        p.draw_eigenvectors();
        if(reset_canvas_boolean){
            grid = [];
            eigen_vectors = [];
            p.setup_grid(grid_size);
            reset_canvas_boolean = false;
        }
    }

    p.draw_grid = function(){
        var step = p.width/grid_size;
        p.noStroke();
        p.fill(0);
        for(x = 0;x < grid_size;x++){
            for(y = 0;y < grid_size;y++){
                var current_tile = grid[y][x];
                if(current_tile == 1){
                    p.rect(x*step,y*step,step,step);
                }
            }
        }
    }

    p.mouseDragged = function(){
        if(p.inScreen()){
            var circle = p.circle_brush(20,250);
            for(i = 0;i < circle.length; i++){
                var current_pos = circle[i];
                grid[current_pos.y][current_pos.x] = 1;
            }
            p.compute_covariance();
        }
    }

    p.circle_brush = function(radius,iteration){
        var output_array = [];
        var mouseVector = p.createVector(p.mouseX,p.mouseY);
        for(i = 0;i < iteration; i++){
            var new_radius = radius * p.sqrt(p.random(0,1));
            var angle = 2 * p.PI * p.random(0,1);
            var new_vector = p5.Vector.fromAngle(angle).mult(new_radius).add(mouseVector);
            output_array.push(p.return_grid_vector(new_vector));
        }
        return output_array;
    }

    p.return_grid_vector = function(input_vector){
        var step = p.width/grid_size;
        return p.createVector(p.floor(p.constrain(input_vector.x/step,0,grid_size)),p.floor(p.constrain(input_vector.y/step,0,grid_size)));
    }

    p.setup_grid = function(size){
        for(y = 0;y < size; y++){
            var current_array = [];
            for(x = 0;x < size; x++){
                current_array.push(0);
            }
            grid.push(current_array);
        }
    }

    p.compute_mean = function(){
        var mean_vector = p.createVector(0,0);
        var counter = 1;
        for(x = 0;x < grid_size; x++){
            for(y = 0;y < grid_size; y++){
                var current_tile = grid[y][x];
                if(current_tile == 1){
                    var new_vector = p.createVector(x,y);
                    mean_vector.add(new_vector);
                    counter++;
                }
            }
        }
        mean_vector.mult(1/counter);
        return mean_vector;
    }

    p.compute_covariance = function(){
        var mean_vector = p.compute_mean();
        var counter = 0;
        var variance_vector = p.createVector(0,0);
        var covariance = 0;
        for(x = 0;x < grid_size; x++){
            for(y = 0;y < grid_size; y++){
                var current_tile = grid[y][x];
                if(current_tile == 1){
                    var current_vector = p.createVector(x,y);
                    var error_vector = p5.Vector.sub(current_vector,mean_vector);
                    variance_vector.add(p.createVector(p.pow(error_vector.x,2),p.pow(error_vector.y,2)));
                    covariance += error_vector.x*error_vector.y;
                    counter++;
                }
            }
        }
        variance_vector.mult(1/counter);
        covariance /= counter;

        var covariance_matrix = math.matrix([[variance_vector.x,covariance],[covariance,variance_vector.y]]);
        var eigen_objects = math.eigs(covariance_matrix);
        eigen_vectors = eigen_objects.vectors._data;
    }

    p.draw_eigenvectors = function(){
        var mean_vector = p.compute_mean().copy().mult(p.width/grid_size);
        var multiplier = 100;
        p.push();
        p.translate(mean_vector.x,mean_vector.y);
        p.stroke(255,0,0);
        p.strokeWeight(2);
        for(i = 0;i < eigen_vectors.length; i++){
            var current_vector = eigen_vectors[i];
            var current_vector_p5 = p.createVector(current_vector[0],current_vector[1]);
            p.line(0,0,current_vector[0]*multiplier,current_vector[1]*multiplier);
            p.push();
            p.translate(current_vector[0]*multiplier,current_vector[1]*multiplier);
            p.rotate(current_vector_p5.heading() + p.PI/2);
            p.line(0,0,-5,10);
            p.line(0,0,5,10),
            p.pop();
        }   
        p.pop();
    }
    
    p.inScreen = function(){
        return (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height);
    }
}
var myp5 = new p5(drawing_script,'drawing_script');