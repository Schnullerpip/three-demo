varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacementTexture;

void main() {
    vec2 uv = vUv;
    vec4 displace = texture2D(uDisplacementTexture, vUv);

    // convert normalized values into regular unit vectors
    float vx = -(displace.r * 2. - 1.);
    float vy = -(displace.g * 2. - 1.);
    // normalized intensity works just fine for intesity
    float intensity = displace.b;
    float amplifier = 0.2;
    uv.x += vx * intensity * amplifier;
    uv.y += vy * intensity * amplifier;

    vec4 image = texture2D(uTexture, uv);

    gl_FragColor = image;
}