use wasm_bindgen::prelude::*;
use js_sys::{Array, Object};

#[wasm_bindgen]
pub struct ParticleSystem {
    particles: Vec<Particle>,
    link_distance: f64,  // Maximum distance for particles to be linked
}

#[derive(Clone)]
struct Particle {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
}

#[wasm_bindgen]
impl ParticleSystem {
    #[wasm_bindgen(constructor)]
    pub fn new(count: usize, w: f64, h: f64, link_distance: f64) -> ParticleSystem {
        // Initialize particles with random positions and velocities
        let mut particles = Vec::with_capacity(count);
        for _ in 0..count {
            particles.push(Particle {
                x: js_sys::Math::random() * w,
                y: js_sys::Math::random() * h,
                vx: (js_sys::Math::random() - 0.5) * 2.0,
                vy: (js_sys::Math::random() - 0.5) * 2.0,
            });
        }
        ParticleSystem { 
            particles,
            link_distance: link_distance  // Default link distance
        }
    }

    pub fn update(&mut self, width: f64, height: f64) {
        for particle in &mut self.particles {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if particle.x <= 0.0 || particle.x >= width {
                particle.vx *= -1.0;
                particle.x = particle.x.clamp(0.0, width);
            }
            if particle.y <= 0.0 || particle.y >= height {
                particle.vy *= -1.0;
                particle.y = particle.y.clamp(0.0, height);
            }
        }
    }

    // Set the maximum distance for particle linking
    pub fn set_link_distance(&mut self, distance: f64) {
        self.link_distance = distance;
    }

    // Get the links between particles
    pub fn get_links(&self) -> JsValue {
        let links = Array::new();
        let particle_count = self.particles.len();

        for i in 0..particle_count {
            for j in (i + 1)..particle_count {
                let p1 = &self.particles[i];
                let p2 = &self.particles[j];

                let dx = p2.x - p1.x;
                let dy = p2.y - p1.y;
                let distance = (dx * dx + dy * dy).sqrt();

                if distance <= self.link_distance {
                    let link = Object::new();
                    let _ = js_sys::Reflect::set(&link, &JsValue::from_str("x1"), &JsValue::from_f64(p1.x));
                    let _ = js_sys::Reflect::set(&link, &JsValue::from_str("y1"), &JsValue::from_f64(p1.y));
                    let _ = js_sys::Reflect::set(&link, &JsValue::from_str("x2"), &JsValue::from_f64(p2.x));
                    let _ = js_sys::Reflect::set(&link, &JsValue::from_str("y2"), &JsValue::from_f64(p2.y));
                    // Calculate opacity based on distance (closer = more opaque)
                    let opacity = 1.0 - (distance / self.link_distance);
                    let _ = js_sys::Reflect::set(&link, &JsValue::from_str("opacity"), &JsValue::from_f64(opacity));
                    links.push(&link);
                }
            }
        }
        links.into()
    }

    pub fn get_particles(&self) -> JsValue {
        let arr = Array::new();
        for particle in &self.particles {
            let obj = Object::new();
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("x"), &JsValue::from_f64(particle.x));
            let _ = js_sys::Reflect::set(&obj, &JsValue::from_str("y"), &JsValue::from_f64(particle.y));
            arr.push(&obj);
        }
        arr.into()
    }

    pub fn get_particle_count(&self) -> usize {
        self.particles.len()
    }

    pub fn set_dimensions(&mut self, width: f64, height: f64) {
        for particle in &mut self.particles {
            particle.x = particle.x.clamp(0.0, width);
            particle.y = particle.y.clamp(0.0, height);
        }
    }

    pub fn cleanup(&mut self) {
        self.particles.clear();
    }
}