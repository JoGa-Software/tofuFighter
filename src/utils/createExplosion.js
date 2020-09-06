function createExplosion(pos, color, num)
{
	var explosion = {};
	var particles = [];
	var t = -num/10.0;
	
	for (var i = 0; i < num; i++)
	{
		p = [];
		for (var j = 0; j < 6; j++)
			p.push(Math.random() - 0.5);
		p[1] += 0.25;
		var l = 1.0/Math.sqrt(p[3]*p[3] + p[4]*p[4] + p[5]*p[5]);
		for (var j = 3; j < 6; j++)
			p[j] *= l;
		particles.push(p);
	}

	var texture = loadTexture('src/assets/gfx/thick.png');
	var box = BufferMesh(BOX_MESH);

	explosion.update = function (dt)
	{
		t += dt;
		if (num == 1)
			t += dt;
		
		if (t > 1)
			removeEntity(explosion);
	};

	var mtx = mat4.create();
	explosion.render = function(worldMtx)
	{
		var alpha = (t < 0) ? 1 : 1 - t;			
	
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.enable(gl.BLEND);
	
		var q = (t + num/10.0)/(1 + num/10.0);
		var s = num*(q - q*q/2.0);
		var r = t * (1 + num/10.0);
		var z = 0.4+num/5;
		if (num > 1)
			s *= 3;
		else
		{
			s = 0;
			r = 0;
			z = (q - q*q*q/2.0) + 0.2;
		}
	
		mat4.translate(worldMtx, pos);
		for (p in particles)
		{
			mat4.set(worldMtx, mtx);
			mat4.translate(mtx, [particles[p][0]*s, particles[p][1]*s, particles[p][2]*s]);
			mat4.rotate(mtx, r+p/3, [particles[p][3], particles[p][4], particles[p][5]]);
			mat4.scale(mtx, [z, z, z]);
			mat4.translate(mtx, [-0.5, -0.5, -0.5]);			
			
			TEX_SHADER.enable(texture);
			TEX_SHADER.setColor([color[0], color[1], color[2], alpha]);
			DrawMesh(box, mtx, TEX_SHADER);
		}
		
		gl.disable(gl.BLEND);
	};

	return explosion;
}