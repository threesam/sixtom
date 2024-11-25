use wasm_bindgen::prelude::*;
use js_sys::{Array, Object};

#[wasm_bindgen]
pub struct ParticleSystem {
    particles: Vec<Particle>,
    threshold: f64,
}

#[derive(Clone)]
struct Particle {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
    radius: f64,
}

#[wasm_bindgen]
impl ParticleSystem {
    #[wasm_bindgen(constructor)]
    pub fn new(count: usize, width: f64, height: f64) -> ParticleSystem {
        let mut particles = Vec::with_capacity(count);
        for _ in 0..count {
            particles.push(Particle {
                x: js_sys::Math::random() * width,
                y: js_sys::Math::random() * height,
                vx: (js_sys::Math::random() - 0.5) * 2.0,
                vy: (js_sys::Math::random() - 0.5) * 2.0,
                radius: 20.0 + js_sys::Math::random() * 20.0, // Random radius between 20 and 40
            });
        }
        ParticleSystem { 
            particles,
            threshold: 1.0,
        }
    }

    pub fn update(&mut self, width: f64, height: f64) {
        for particle in &mut self.particles {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if particle.x <= particle.radius || particle.x >= width - particle.radius {
                particle.vx *= -1.0;
                particle.x = particle.x.clamp(particle.radius, width - particle.radius);
            }
            if particle.y <= particle.radius || particle.y >= height - particle.radius {
                particle.vy *= -1.0;
                particle.y = particle.y.clamp(particle.radius, height - particle.radius);
            }
        }
    }

    pub fn get_particles(&self) -> JsValue {
        let arr = Array::new();
        for particle in &self.particles {
            let obj = Object::new();
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("x"), &JsValue::from_f64(particle.x));
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("y"), &JsValue::from_f64(particle.y));
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("radius"), &JsValue::from_f64(particle.radius));
            arr.push(&obj);
        }
        arr.into()
    }

    pub fn set_dimensions(&mut self, width: f64, height: f64) {
        for particle in &mut self.particles {
            particle.x = particle.x.clamp(particle.radius, width - particle.radius);
            particle.y = particle.y.clamp(particle.radius, height - particle.radius);
        }
    }

    pub fn cleanup(&mut self) {
        self.particles.clear();
    }
}